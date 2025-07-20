import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface NotificationSettings {
    messageNotifications: boolean;
    friendRequests: boolean;
    groupInvites: boolean;
    callNotifications: boolean;
    emailNotifications: boolean;
}

interface NotificationSettingsProps {
    notifications: NotificationSettings;
    onNotificationChange: (key: keyof NotificationSettings) => void;
}

export function NotificationSettings({ notifications, onNotificationChange }: NotificationSettingsProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5">
                                    <Label>Message Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when you receive new messages
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.messageNotifications}
                                    onCheckedChange={() => onNotificationChange('messageNotifications')}
                                />
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5">
                                    <Label>Friend Requests</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when someone sends you a friend request
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.friendRequests}
                                    onCheckedChange={() => onNotificationChange('friendRequests')}
                                />
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5">
                                    <Label>Group Invites</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when you're invited to join a group
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.groupInvites}
                                    onCheckedChange={() => onNotificationChange('groupInvites')}
                                />
                            </div>
                            <Separator />
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="space-y-0.5">
                                    <Label>Call Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified for incoming voice and video calls
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications.callNotifications}
                                    onCheckedChange={() => onNotificationChange('callNotifications')}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="space-y-0.5">
                                <Label>Email Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive important updates via email
                                </p>
                            </div>
                            <Switch
                                checked={notifications.emailNotifications}
                                onCheckedChange={() => onNotificationChange('emailNotifications')}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
