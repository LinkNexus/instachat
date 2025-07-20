import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, HelpCircle, LogOut, MessageSquare } from "lucide-react";

export function HelpSettings() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <HelpCircle className="h-4 w-4 mr-2" />
                                Help Center
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact Support
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Globe className="h-4 w-4 mr-2" />
                                Privacy Policy
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Globe className="h-4 w-4 mr-2" />
                                Terms of Service
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">App Information</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Version: 1.0.0</p>
                            <p>Last Updated: December 2024</p>
                            <p>Build: 2024.12.001</p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Button variant="destructive" className="w-full">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
