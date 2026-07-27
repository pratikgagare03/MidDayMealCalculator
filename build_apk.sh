#!/bin/bash
# Portable Android APK compilation script
# Set execution to fail on errors
set -e

# Resolve directory where script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME="$HOME/android-sdk"
export PATH="$HOME/gradle-8.2.1/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

echo "=== System Check ==="
echo "Java Version:"
java -version

# 1. Download Gradle 8.2.1
if [ ! -d "$HOME/gradle-8.2.1" ]; then
    echo "--------------------------------------"
    echo "Downloading Gradle 8.2.1 (approx. 120MB)..."
    wget -q --show-progress -O /tmp/gradle.zip https://services.gradle.org/distributions/gradle-8.2.1-bin.zip
    echo "Extracting Gradle..."
    unzip -q /tmp/gradle.zip -d "$HOME"
    rm /tmp/gradle.zip
    echo "Gradle installed successfully!"
else
    echo "Gradle already installed in $HOME/gradle-8.2.1."
fi

# 2. Download Android Command Line Tools
if [ ! -d "$ANDROID_HOME/cmdline-tools/latest" ]; then
    echo "--------------------------------------"
    echo "Downloading Android SDK Command Line Tools (approx. 120MB)..."
    wget -q --show-progress -O /tmp/cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
    echo "Extracting Android SDK Tools..."
    mkdir -p "$ANDROID_HOME/cmdline-tools"
    unzip -q /tmp/cmdline-tools.zip -d "$ANDROID_HOME/cmdline-tools"
    mv "$ANDROID_HOME/cmdline-tools/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"
    rm /tmp/cmdline-tools.zip
    echo "Android SDK Tools installed successfully!"
else
    echo "Android SDK Tools already installed in $ANDROID_HOME."
fi

# 3. Accept licenses automatically
echo "--------------------------------------"
echo "Accepting Android SDK licenses..."
yes | sdkmanager --licenses > /dev/null || true

# 4. Install Platform 34 and Build-Tools 34.0.0
echo "--------------------------------------"
echo "Downloading target Android Platform 34 & Build-Tools (approx. 150MB)..."
sdkmanager --install "platforms;android-34" "build-tools;34.0.0"

# 5. Build Gradle project
echo "--------------------------------------"
echo "Compiling Android project and generating APK..."
cd "$SCRIPT_DIR/android"
gradle clean assembleDebug

echo "--------------------------------------"
echo "BUILD COMPLETED SUCCESSFULLY!"
echo "APK Location:"
ls -lh app/build/outputs/apk/debug/app-debug.apk
