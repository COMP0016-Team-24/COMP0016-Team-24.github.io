---
layout: post
title: "Writing a blog article"
date: "2020-10-15T19:42:23.546Z"
categories: meta
---
This blog is built on a static site generator called Jekyll. It converts markdown files into html files, resulting in a whole static html website, which is then hosted by GitHub.

## Creating posts

To create a new post, create a file in the `_posts` folder named in the following format:
```
yyyy-mm-dd-post-short-title.markdown
```

For example, this article resides in `_posts/2020-10-15-writing-blog.markdown`. You would then need to add a "front matter" to the top of the markdown file.

### Front matter

A front matter describes metadata about the post. It should look like this:
```markdown
---
layout: post
title: "Writing a blog article"
date: "2020-10-15T19:42:23.546Z"
categories: meta
---
```

Change the `title` into a descriptive title of your post. It doesn't have to be the same with the short title in the file name. Change `date` to <code id="current-time">ENABLE JAVASCRIPT</code><script src="/assets/js/writing-blog.js"></script>, and change `categories` into something like `dev` or `features`.

**Warning**: changing the date of an article changes its URL. Don't do it when not necessary.

A markdown help guide can be found at [https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf).

### Proper syntax highlighting

You should annotate the language of your code snippet if possible. For example:

````markdown
```javascript
console.log("Hello world");
```
````

## Running Jekyll locally

To see the resulting website while you write, you can either:
- Use the vscode devcontainer contained within this repository and run `jekyll serve`, or
- Download and install Ruby and Jekyll (`gem install bundler jekyll`) then run `jekyll serve` on the repo root.

Initially the setup/docker image building can take quite a while, since Jekyll has many dependencies.

**Warning**: do not add anything under `_site` or `.jekyll-cache` into git, nor modify them manually.

## Drafts

If you need to add an unfinished article to git, place them under the `_drafts` folder. You also have to run your jekyll with the `--draft` flag to see them. They won't appear on github.io page.
