# SnapCal

Paste text or snap a photo, and the events go straight into Google Calendar.
It runs in any browser and installs on your phone's home screen like an app.

Your Google Client ID is already built in. Your Gemini key is **not** in these files (the site is public),
so you add it once per device with your setup link.

## 1. Put it online (GitHub Pages, free)

1. Sign in at [github.com](https://github.com), click **New repository**, name it `snapcal`, set it to **Public**, and click **Create repository**.
2. Click **uploading an existing file**, drag in everything from this zip (`index.html`, `sw.js`, `manifest.webmanifest`, `README.md` and the `icons` folder), and click **Commit changes**.
3. Go to **Settings → Pages**, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, and click **Save**.
4. After a minute it's live at `https://lechlak.github.io/snapcal/`.

## 2. Check your Google Cloud client

In [Google Cloud → Clients](https://console.cloud.google.com/auth/clients), open the client whose ID ends in `...6gis1d.apps.googleusercontent.com`:

- Its type must be **Web application**.
- Under **Authorized JavaScript origins**, add `https://lechlak.github.io` (no `/snapcal`, no trailing slash) and click **Save**.
- The Google Calendar API must be enabled, and your Gmail must be listed under **Audience → Test users**.

The app doesn't use the client secret.

## 3. Lock your Gemini key to your site (recommended)

In [Google Cloud → Credentials](https://console.cloud.google.com/apis/credentials), open your Gemini key. Under **Application restrictions**, choose **Websites** and add `https://lechlak.github.io/*`.

## 4. Set up each device

1. Open your setup link (Claude sent it in the chat). It saves your Gemini key on that device and then removes it from the address bar.
2. Tap **Connect Google** and approve. Google warns that the app is unverified because it's your own private app. Tap **Continue**.
3. Install it:
   - **iPhone (Safari):** tap Share, then **Add to Home Screen**.
   - **Android (Chrome):** tap ⋮, then **Install app**.

If you lose the link, you can also paste the key in **Settings**.

## Using it

- Paste text and/or add photos, screenshots or PDFs, then tap **Find events**.
- Check the events, fix or uncheck any, pick a calendar, and tap **Add**.
- On Android, once it's installed, SnapCal shows up in the share sheet.
- Google sign-in lasts about an hour. After that, tapping **Add** reconnects, usually with no prompt.

## Troubleshooting

| Problem | Fix |
|---|---|
| `origin_mismatch` / `redirect_uri_mismatch` | Add `https://lechlak.github.io` under Authorized JavaScript origins (step 2). |
| "Access blocked: app has not completed verification" | Add your Gmail under **Audience → Test users**. |
| "Gemini API key was rejected" | Open your setup link again, or re-paste the key in Settings. If you restricted it, check the website pattern. |
| "Model wasn't found" | In Settings, set the model to another current Flash model. |
| Sign-in popup blocked | Allow popups for the site and tap **Connect Google** again. |
