import { redirect } from 'next/navigation';
import { getUserProfile } from '@/actions/user';
import ProfileDashboard from '@/components/dashboard/ProfileDashboard';

export default async function ProfilePage() {
    const user = await getUserProfile();

    if (!user) {
        redirect('/login');
    }

    return <ProfileDashboard user={user} />;
}
