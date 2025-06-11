# Fastlane Example for Automated Mobile App Store Uploads

## 1. Install Fastlane

```sh
sudo gem install fastlane -NV
```

## 2. Initialize Fastlane in Your Project

```sh
cd android # or ios
fastlane init
```

## 3. Example Fastfile for Android

```ruby
default_platform(:android)

platform :android do
  desc "Deploy a new version to the Google Play"
  lane :deploy do
    gradle(task: "assembleRelease")
    upload_to_play_store(track: 'production')
  end
end
```

## 4. Example Fastfile for iOS

```ruby
default_platform(:ios)

platform :ios do
  desc "Deploy a new version to the App Store"
  lane :deploy do
    build_app(scheme: "YourAppScheme")
    upload_to_app_store
  end
end
```

## 5. Run Fastlane

```sh
fastlane deploy
``` 