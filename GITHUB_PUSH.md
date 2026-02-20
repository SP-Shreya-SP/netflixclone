# Push to GitHub - Quick Guide

Your code is committed locally. Follow these steps to push to GitHub:

## Step 1: Create Repository on GitHub

1. Go to **https://github.com/new**
2. Repository name: **`netflixclone`** (all lowercase, no spaces)
3. Description: `Netflix-style movie web application with TMDB integration and Aiven MySQL`
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Push Your Code

After creating the repo, GitHub will show you commands. Use these instead (already configured):

```bash
cd c:\Users\WIN10\Desktop\NetflixClone
git remote add origin https://github.com/YOUR_USERNAME/netflixclone.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Alternative: If you already have a remote

If you've already added the remote, just run:

```bash
cd c:\Users\WIN10\Desktop\NetflixClone
git branch -M main
git push -u origin main
```

## Done!

Your repository will be live at: `https://github.com/YOUR_USERNAME/netflixclone`

---

**Note:** Make sure you're logged into GitHub in your browser and have the correct permissions to create repositories.
