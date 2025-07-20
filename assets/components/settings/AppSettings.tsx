import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Download, Trash2 } from "lucide-react";

interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    fontSize: 'small' | 'medium' | 'large';
    autoDownloadMedia: boolean;
    enterToSend: boolean;
    soundNotifications: boolean;
}

interface AppSettingsProps {
    appSettings: AppSettings;
    onAppSettingToggle: (key: keyof AppSettings) => void;
    onAppSettingChange: (key: keyof AppSettings, value: string) => void;
}

export function AppSettings({ appSettings, onAppSettingToggle, onAppSettingChange }: AppSettingsProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Theme</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Choose your preferred theme
                                    </p>
                                </div>
                                <Select
                                    value={appSettings.theme}
                                    onValueChange={(value) => onAppSettingChange('theme', value)}
                                >
                                    <SelectTrigger className="w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Font Size</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Adjust text size for better readability
                                    </p>
                                </div>
                                <Select
                                    value={appSettings.fontSize}
                                    onValueChange={(value) => onAppSettingChange('fontSize', value)}
                                >
                                    <SelectTrigger className="w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Language</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Choose your preferred language
                                    </p>
                                </div>
                                <Select
                                    value={appSettings.language}
                                    onValueChange={(value) => onAppSettingChange('language', value)}
                                >
                                    <SelectTrigger className="w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                        <SelectItem value="de">Deutsch</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Chat Settings</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5">
                                    <Label>Auto-download Media</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically download photos and videos
                                    </p>
                                </div>
                                <Switch
                                    checked={appSettings.autoDownloadMedia}
                                    onCheckedChange={() => onAppSettingToggle('autoDownloadMedia')}
                                />
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5">
                                    <Label>Enter to Send</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Press Enter to send messages
                                    </p>
                                </div>
                                <Switch
                                    checked={appSettings.enterToSend}
                                    onCheckedChange={() => onAppSettingToggle('enterToSend')}
                                />
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5">
                                    <Label>Sound Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Play sounds for notifications
                                    </p>
                                </div>
                                <Switch
                                    checked={appSettings.soundNotifications}
                                    onCheckedChange={() => onAppSettingToggle('soundNotifications')}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Storage</h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <Download className="h-4 w-4 mr-2" />
                                Download All Data
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear Cache
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
