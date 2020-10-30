---
layout: post
title: "Passing audio into docker container"
date: "2020-10-30 22:52:07+00:00"
categories: dev problem-solving
---

## Background

The existing virtual assistence relies on Alexa, and contains python code that interacts with the Alexa python library, which in terms handles recording and playing of audio. It appears that this is done with ALSA command line utilities (`aplay` and `arecord`).

One requirement we have is to simplify the deployment of our software. The existing python code has a lot of dependencies, some of which needs to be installed with `pip` and some of it are Linux libraries. Currently there is a setup script that assumes Ubuntu, and upon inspection it seems to only work on certain older version of Ubuntu as well.

Because of this, as well as the fact that some of our team member are having issue setting up this component of the project, we decided to try to package the AVS code into a Docker container.

<img alt="A: It works on my machine; B: Then we will ship your machine; N: And that is how docker was born" src="/assets/images/docker-container.jpg" class="center">

## The solution

Here is the end solution we came up with:

Make sure that the container has the pulseaudio plugin for ALSA installed (package name can be `pulseaudio` or `pulseaudio-alsa`) even if your application uses ALSA tools. Then, run docker with:

```
docker run \
  -v /run/user/1000/pulse/native:/run/user/1000/pulse/native \
  -e PULSE_SERVER=unix:/run/user/1000/pulse/native \
  -u 1000:1000 \
  ...
```

Replace `1000` with your host UID. Your container must run with the same UID as your host user for the application to connect to the pulse socket.

## How audio on Linux works

### The wrong solution

When you Google "pass audio inside docker", most of the result tells you to use `--device=/dev/snd:/dev/snd`. This is usually not the proper way to pass in audio, because it requires the container to get exclusive access to your audio hardware. In other words, if you use `--device` to pass `/dev/snd/*`, your app inside container won't work if you are also playing a music (or more likely for us, on a Teams call). Even if not, it may sometime still error with `Device or resource busy`, because your desktop "audio manager"&mdash;pulseaudio&mdash;will likely keep the device open for a short period after playing any sound.

### ALSA and PulseAudio

Like most hardware, accessing audio on Linux involves both the kernel driver and a user-space library. ALSA is the kernel driver responsible for managing audio devices, while it also provides a set of user-space tools (such as `aplay`) and APIs for audio-playing applications.

However, as is commonly seen on Linux, a device can only be open by one application at a time, and ALSA itself does not provide audio mixing capabilities which allows multiple apps to play or record at the same time. Therefore, most Linux desktop setup will run a "audio server" that is solely responsible for talking to the kernel ALSA interface, and the most common audio server is PulseAudio. Applications wanting to play audio should talk to PulseAudio, instead of opening ALSA devices under `/dev/snd` themselves.

To support older applications which directly uses ALSA library, and also make developer's life easier, the ALSA user-space library actually implements a plugin for PulseAudio that lets ALSA applications use a fake "pulse" device. Audio played or recorded from this device are actually passed to PulseAudio. This is why we don't need to expose `/dev/snd` to the container, and should instead expose our pulseaudio socket, which is usually located under `/run/user/1000/pulse`.

Usually the pulseaudio plugin will automatically discover the pulse socket in `/run/user/1000/pulse`. However, inside a container, the `/run/user/1000` directory might be newly created by `docker run` and hence is not owned by the correct uid, and it will not connect automatically in this case. The solution is to inject an environment variable `PULSE_SERVER=unix:/run/user/1000/pulse/native` so that it will connect to it no matter what.
