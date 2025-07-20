import {AppSettings} from "@/components/settings/AppSettings";
import {HelpSettings} from "@/components/settings/HelpSettings";
import {NotificationSettings} from "@/components/settings/NotificationSettings";
import {PrivacySettings} from "@/components/settings/PrivacySettings";
import {ProfileSettings} from "@/components/settings/ProfileSettings";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";

interface UserProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
}

interface NotificationSettings {
  messageNotifications: boolean;
  friendRequests: boolean;
  groupInvites: boolean;
  callNotifications: boolean;
  emailNotifications: boolean;
}

interface PrivacySettings {
  profileVisibility: 'everyone' | 'friends' | 'nobody';
  lastSeenVisibility: 'everyone' | 'friends' | 'nobody';
  phoneNumberVisibility: 'everyone' | 'friends' | 'nobody';
  profilePhotoVisibility: 'everyone' | 'friends' | 'nobody';
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  autoDownloadMedia: boolean;
  enterToSend: boolean;
  soundNotifications: boolean;
}

export function Settings() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    username: "john_doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Hey there! I'm using this messaging app.",
    avatar: "https://github.com/shadcn.png",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    messageNotifications: true,
    friendRequests: true,
    groupInvites: true,
    callNotifications: true,
    emailNotifications: false,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'friends',
    lastSeenVisibility: 'friends',
    phoneNumberVisibility: 'friends',
    profilePhotoVisibility: 'everyone',
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'system',
    language: 'en',
    fontSize: 'medium',
    autoDownloadMedia: true,
    enterToSend: true,
    soundNotifications: true,
  });

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    console.log("Profile updated:", updatedProfile);
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAppSettingToggle = (key: keyof AppSettings) => {
    if (typeof appSettings[key] === 'boolean') {
      setAppSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleAppSettingChange = (key: keyof AppSettings, value: string) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and app preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs sm:text-sm">Privacy</TabsTrigger>
            <TabsTrigger value="app" className="text-xs sm:text-sm">App</TabsTrigger>
            <TabsTrigger value="help" className="text-xs sm:text-sm">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileSettings
              profile={profile}
              onProfileUpdate={handleProfileUpdate}
            />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationSettings
              notifications={notifications}
              onNotificationChange={handleNotificationChange}
            />
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <PrivacySettings
              privacy={privacy}
              onPrivacyChange={handlePrivacyChange}
            />
          </TabsContent>

          <TabsContent value="app" className="mt-6">
            <AppSettings
              appSettings={appSettings}
              onAppSettingToggle={handleAppSettingToggle}
              onAppSettingChange={handleAppSettingChange}
            />
          </TabsContent>

          <TabsContent value="help" className="mt-6">
            <HelpSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
