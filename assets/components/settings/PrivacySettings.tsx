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
import { Eye, Lock, Users } from "lucide-react";

interface PrivacySettings {
    profileVisibility: 'everyone' | 'friends' | 'nobody';
    lastSeenVisibility: 'everyone' | 'friends' | 'nobody';
    phoneNumberVisibility: 'everyone' | 'friends' | 'nobody';
    profilePhotoVisibility: 'everyone' | 'friends' | 'nobody';
}

interface PrivacySettingsProps {
    privacy: PrivacySettings;
    onPrivacyChange: (key: keyof PrivacySettings, value: string) => void;
}

export function PrivacySettings({ privacy, onPrivacyChange }: PrivacySettingsProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Profile Privacy</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Profile Visibility</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Who can see your profile information
                                    </p>
                                </div>
                                <Select
                                    value={privacy.profileVisibility}
                                    onValueChange={(value) => onPrivacyChange('profileVisibility', value)}
                                >
                                    <SelectTrigger className="w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="everyone">Everyone</SelectItem>
                                        <SelectItem value="friends">Friends</SelectItem>
                                        <SelectItem value="nobody">Nobody</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Last Seen</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Who can see when you were last online
                                    </p>
                                </div>
                                <Select
                                    value={privacy.lastSeenVisibility}
                                    onValueChange={(value) => onPrivacyChange('lastSeenVisibility', value)}
                                >
                                    <SelectTrigger className="w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="everyone">Everyone</SelectItem>
                                        <SelectItem value="friends">Friends</SelectItem>
                                        <SelectItem value="nobody">Nobody</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Phone Number</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Who can see your phone number
                                    </p>
                                </div>
                                <Select
                                    value={privacy.phoneNumberVisibility}
                                    onValueChange={(value) => onPrivacyChange('phoneNumberVisibility', value)}
                                >
                                    <SelectTrigger className="w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="everyone">Everyone</SelectItem>
                                        <SelectItem value="friends">Friends</SelectItem>
                                        <SelectItem value="nobody">Nobody</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5 flex-1">
                                    <Label>Profile Photo</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Who can see your profile photo
                                    </p>
                                </div>
                                <Select
                                    value={privacy.profilePhotoVisibility}
                                    onValueChange={(value) => onPrivacyChange('profilePhotoVisibility', value)}
                                >
                                    <SelectTrigger className="w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="everyone">Everyone</SelectItem>
                                        <SelectItem value="friends">Friends</SelectItem>
                                        <SelectItem value="nobody">Nobody</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Security</h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <Lock className="h-4 w-4 mr-2" />
                                Change Password
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Eye className="h-4 w-4 mr-2" />
                                Two-Factor Authentication
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Users className="h-4 w-4 mr-2" />
                                Blocked Users
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
