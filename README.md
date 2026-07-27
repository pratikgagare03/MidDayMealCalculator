# Mid-Day Meal (MDM) Calculator (शालेय पोषण आहार गणक)

A premium, bilingual, and completely offline-capable **Mid-Day Meal (MDM) Calculator** application tailored for primary and upper-primary school teachers in Maharashtra, India. It computes exact grain weights (in both Kilograms and Grams) and financial cooking costs for a given student attendance in seconds.

The project is structured as a responsive Single-Page Web Application (PWA) compiled inside an Android Gradle container wrapper supporting **Android API Level 16 (Jelly Bean) up to the latest Android 15/16**.

---

## ✨ Features

*   **Bilingual Translation UI:** Instantly toggle the app language between Marathi (`मराठी`) and English (`EN`) using the header language selector.
*   **Marathi Registry Preservation:** Core ingredient names (तांदूळ, डाळ, जिरे, etc.) and weekly menu names are kept in standard Marathi to match official government school records, even when the interface is set to English.
*   **Bifurcated 4-Column Table:**
    1.  **तपशील (Details):** Ingredient name.
    2.  **वजन (कि.ग्रॅ.) / खर्च (रु.):** Clean numeric values for weights in kilograms, or explicit currency prefixed values (e.g. `रु. ३६.००`) for costs.
    3.  **वजन (ग्रॅम):** Clean numeric weight values converted to grams with a localized thousands separator (e.g. `5,000` instead of `5000`) for easy reading by cooking staff.
    4.  **प्रमाण (कि.ग्रॅ. / रु.):** Standard per-student rate.
*   **Section Dividers:** A visual double-thick accent border divider separates the physical weights (grains/spices) from the financial cash expenses (vegetables, fuel, supplementary diet), making calculations easy to parse.
*   **Total Cooking Cost Box:** A large, gradient-styled dashboard box at the bottom displaying the total cost with clear currency formats.
*   **Theme Toggle:** Switch between a modern Light Mode and Dark Mode.
*   **100% Offline PWA:** Integrates a cache-first Service Worker (`sw.js`) and PWA web manifest (`manifest.json`) for full offline availability.
*   **Bespoke 3D Launcher Icon:** Custom-designed 3D clay icon featuring a plate of hot school food alongside a glowing green math calculator logo.

---

## 📂 Project Structure

```text
mdm-calci-app/
├── index.html            # Main SPA structure (Home, Calculators, Recipes, BMI, Settings, Help, About)
├── style.css             # Premium custom CSS styling (Variables, glassmorphism cards, responsive grids)
├── app.js                # Core JS logic (State management, Indian number formatting, local storage, navigation)
├── manifest.json         # PWA Manifest configuration
├── sw.js                 # Service Worker caching logic (Cache version v7)
├── icon.png              # Custom 3D App Icon
├── mdm-calci-v2.5.apk    # Compiled Android APK (Ready to install, 9.9 MB)
│
└── android/              # Native Android wrapper project (Android Studio & Gradle)
    ├── build.gradle      # Root build configuration
    ├── settings.gradle   # Gradle settings
    ├── gradle.properties # Custom properties (enabled AndroidX)
    ├── README.md         # Android build and compiler guide
    └── app/
        ├── build.gradle  # Module build configuration (minSdkVersion 16, targetSdkVersion 34)
        └── src/main/
            ├── AndroidManifest.xml   # Manifest declaring launcher icon properties
            ├── java/in/curiosityworld/www/mdmcalci/MainActivity.java  # WebView activity with history handlers
            └── assets/www/            # WebView local asset directory (Synced copies of HTML/CSS/JS/icon)
```

---

## 🚀 Local Development & Testing

You can run the web app locally on your computer with any static HTTP server. For example, using Python:

```bash
# Navigate to the project folder
cd mdm-calci-app

# Start Python HTTP server
python3 -m http.server 8080
```
Open your browser and navigate to `http://localhost:8080`.

---

## 🛠️ How to Compile the APK

The wrapper project is pre-configured with dependencies. You can build it in two ways:

### Method 1: Using Android Studio (Recommended)
1.  Open **Android Studio**.
2.  Click **Open** and select the `/mdm-calci-app/android` folder.
3.  Let Android Studio sync the Gradle files and download the Android API Platform 34 components.
4.  Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** in the top menu.
5.  Find the output APK at:
    `android/app/build/outputs/apk/debug/app-debug.apk`

### Method 2: Command Line Compilation (Local SDK)
If you have Java 17 and Android SDK set up, compile using:
```bash
cd mdm-calci-app/android
./gradlew assembleDebug
```

---

## 👤 Developer Profile

*   **Developer Name:** Pratik Gagare
*   **Contact Mobile:** +91 9421329901
*   **Email Address:** pratikgagare302002@gmail.com
*   *Please contact for any feature requests or technical support.*
