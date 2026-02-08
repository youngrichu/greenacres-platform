'use client';

import { useState } from 'react';
import { useAuth } from '@greenacres/auth';
import { updateUserProfile } from '@greenacres/db';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Input,
    Label,
    Badge
} from '@greenacres/ui';
import {
    User,
    Building2,
    Mail,
    Phone,
    MapPin,
    Save,
    CheckCircle,
    Loader2
} from 'lucide-react';

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        contactPerson: user?.contactPerson || '',
        phone: user?.phone || '',
        country: user?.country || '',
    });

    const handleSave = async () => {
        if (!user?.id) return;

        try {
            setIsSaving(true);
            await updateUserProfile(user.id, formData);
            await refreshUser();
            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 lg:mb-8 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-serif text-cream mb-2">Profile Settings</h1>
                <p className="text-cream/50 text-sm sm:text-base">Manage your account information</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-6 glass rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-cream">Profile updated successfully!</span>
                </div>
            )}

            {/* Company Info Card */}
            <Card className="glass-card rounded-xl mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <CardHeader className="border-b border-gold/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-cream flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-gold" />
                                Company Information
                            </CardTitle>
                            <CardDescription className="text-cream/50">
                                Your registered company details
                            </CardDescription>
                        </div>
                        <Badge className="badge-gold">
                            {user?.companyType || 'Buyer'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="glass rounded-xl p-4">
                        <Label className="text-cream/60 text-sm">Company Name</Label>
                        <p className="text-cream font-medium text-lg">{user?.companyName || 'N/A'}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                        <Label className="text-cream/60 text-sm">Email Address</Label>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gold/60" />
                            <p className="text-cream">{user?.email || 'N/A'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Info Card */}
            <Card className="glass-card rounded-xl mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <CardHeader className="border-b border-gold/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-cream flex items-center gap-2">
                                <User className="w-5 h-5 text-gold" />
                                Contact Information
                            </CardTitle>
                            <CardDescription className="text-cream/50">
                                Your personal contact details
                            </CardDescription>
                        </div>
                        {!isEditing && (
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="btn-ghost"
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    {isEditing ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="contactPerson" className="text-cream/80">Contact Person</Label>
                                <Input
                                    id="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    className="input-premium"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-cream/80">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input-premium"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-cream/80">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="input-premium"
                                    placeholder="United States, Germany, etc."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="btn-premium flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            contactPerson: user?.contactPerson || '',
                                            phone: user?.phone || '',
                                            country: user?.country || '',
                                        });
                                    }}
                                    className="btn-ghost"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="glass rounded-xl p-4">
                                <Label className="text-cream/60 text-sm">Contact Person</Label>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gold/60" />
                                    <p className="text-cream">{user?.contactPerson || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="glass rounded-xl p-4">
                                <Label className="text-cream/60 text-sm">Phone Number</Label>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gold/60" />
                                    <p className="text-cream">{user?.phone || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="glass rounded-xl p-4">
                                <Label className="text-cream/60 text-sm">Country</Label>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gold/60" />
                                    <p className="text-cream">{user?.country || 'Not set'}</p>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="glass-card rounded-xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <CardHeader className="border-b border-gold/10">
                    <CardTitle className="text-cream flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-gold" />
                        Account Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-cream font-medium">Approved Account</p>
                            <p className="text-cream/50 text-sm">
                                You have full access to the buyer portal
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
