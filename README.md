<p align="center">
  <img src="public/webmanifest_pro_logo.png" alt="WebManifest Pro" height="200" />
</p>

# WebManifest Pro

**Manifest generator for your WebApp.**

## It generates various size images for your app's manifest:

- **android_chrome_192X192**
- **android_chrome_512X512**
- **apple_touch_icon**
- **favicon_16X16**
- **favicon_32X32**
- **favicon_96X96**
- **mstile_150X150**
- **safari_pinned_tab**

---

## 🌐 View Live

[WebManifest Pro](https://webmanifest-pro.vercel.app/)

---

## ✨ Features

- Light/dark mode toggle.
- Live previews of generated manifest images.
- Cross-platform support for multiple devices.
- Image cropping option for more customized icon generation.

---

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org/)**: For building the user interface and handling server-side rendering.
- **[Tailwind CSS](https://tailwindcss.com/)**: For styling the components with a utility-first approach.

---

## 📚 Lessons Learned

- **Image Compression**: Implemented compression techniques to optimize images for faster load times.
- **Image Manipulation with Sharp**: Leveraged the `sharp` library to resize and manipulate images dynamically.
- **Abort Controller**: Used Abort Controller to cancel requests and improve the app's responsiveness during cleanup.

---

## 🚀 Optimizations

- Added **Abort Controller** to cancel any ongoing requests on cleanup for better performance.
- Added **Key controls** for the selection of crop.
- Applied **Image Compression** to reduce the size of images without sacrificing quality.

---

## 📄 Available Scripts

```bash
# Start the development server
npm run dev

# Build the project for production
npm run build

# Preview the production build
npm run preview
```
