import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Edit3 } from "lucide-react";
import { useState } from "react";

interface UserProfile {
    name: string;
    username: string;
    email: string;
    phone: string;
    bio: string;
    avatar?: string;
}

interface ProfileSettingsProps {
    profile: UserProfile;
    onProfileUpdate: (profile: UserProfile) => void;
}

export function ProfileSettings({ profile, onProfileUpdate }: ProfileSettingsProps) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);

    const handleProfileUpdate = () => {
        setIsEditingProfile(false);
        onProfileUpdate(editedProfile);
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setEditedProfile(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile.avatar} />
                            <AvatarFallback className="text-2xl">
                                {profile.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                        >
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold">{profile.name}</h2>
                        <p className="text-muted-foreground">@{profile.username}</p>
                        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="mt-2">
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={editedProfile.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            value={editedProfile.username}
                                            onChange={(e) => handleInputChange("username", e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="bio" className="text-right">
                                            Bio
                                        </Label>
                                        <Textarea
                                            id="bio"
                                            value={editedProfile.bio}
                                            onChange={(e) => handleInputChange("bio", e.target.value)}
                                            className="col-span-3"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleProfileUpdate}>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => onProfileUpdate({ ...profile, email: e.target.value })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => onProfileUpdate({ ...profile, phone: e.target.value })}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="bio-display">Bio</Label>
                        <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                            {profile.bio}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
