# MDM Calci - Android Wrapper Build Guide

This directory contains the standard Android Studio wrapper project for the Mid-Day Meal (MDM) Calculator. It compiles the responsive offline-capable web application assets (`www/` folder) into a native Android APK using an Android `WebView` interface, supporting Android API Level 16 (Jelly Bean) up to the latest Android versions.

## How to Compile the APK using Android Studio

### Prerequisites
1. Download and install **Android Studio** (Koala or latest version).
2. Ensure you have the **Java Development Kit (JDK 17 or higher)** installed (Android Studio includes its own embedded JDK).

### Steps to Import and Build

1. **Open Android Studio:**
   * Launch Android Studio and click **Open** (or **File > Open**).
   * Navigate to this directory: `/home/nityaobject/pratik/vibe_code/mdm-calci-app/android` and select the folder containing `settings.gradle` and click **OK**.

2. **Gradle Sync & Dependency Download:**
   * Android Studio will open the project and automatically download the correct version of Gradle, Android SDK Build-Tools, and standard support libraries (AppCompat).
   * Wait for the Gradle sync process to finish (indicated by the progress bar at the bottom).

3. **Build the APK:**
   * In the top menu, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   * Android Studio will compile the assets and compile the Java code.

4. **Locate the Output APK:**
   * Once building completes, a popup notification will appear at the bottom-right corner of Android Studio. Click **Locate** to open the folder containing the APK.
   * Alternatively, you can find the generated APK file at:
     `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Modifying Web Assets
The HTML, CSS, and JS assets are loaded locally from the APK assets directory:
`android/app/src/main/assets/www/`

If you modify the files in the root `mdm-calci-app/` folder, make sure to copy them to the assets folder using:
```bash
cp index.html style.css app.js manifest.json sw.js icon.png android/app/src/main/assets/www/
```
Then rebuild the APK in Android Studio.
