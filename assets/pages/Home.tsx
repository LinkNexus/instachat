import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  Globe,
  Heart,
  MessageSquare,
  Shield,
  Users,
  Zap
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: MessageSquare,
    title: "Instant Messaging",
    description: "Send messages instantly with real-time delivery and read receipts.",
  },
  {
    icon: Users,
    title: "Friends System",
    description: "Connect with friends through a secure invitation-based system.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your conversations are encrypted and your privacy is protected.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with modern technology for the fastest messaging experience.",
  },
  {
    icon: Globe,
    title: "Cross Platform",
    description: "Use on any device, anywhere. Your messages sync seamlessly.",
  },
  {
    icon: Heart,
    title: "Ad-Free",
    description: "Focus on what matters - your conversations, without distractions.",
  },
];

const stats = [
  { label: "Active Users", value: "10M+" },
  { label: "Messages Sent", value: "1B+" },
  { label: "Countries", value: "150+" },
  { label: "Uptime", value: "99.9%" },
];

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            🎉 Now with enhanced privacy features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Connect with Friends,
            <br />
            Securely & Instantly
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The modern messaging app that puts your privacy first. Send messages,
            make friends, and stay connected with the people who matter most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8">
                Start Chatting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/friends">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Find Friends
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose InstaChat?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with the latest technology and designed with your needs in mind.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join millions of users who trust InstaChat for their daily communications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-chart-1 mr-2" />
                Free to use
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-chart-1 mr-2" />
                No ads
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-chart-1 mr-2" />
                End-to-end encrypted
              </div>
            </div>
            <div className="mt-6">
              <Link href="/chat">
                <Button size="lg" className="text-lg px-8">
                  Start Your First Chat
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
