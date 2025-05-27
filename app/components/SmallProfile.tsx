import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export default async function SmallProfile({ userId }: { userId: string }) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    return (
        <Link
            href={`/profile`}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r from-purple-50 to-pink-50 
            transition-all duration-300"
        >
            {user?.iconUrl ? (
                <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src={user.iconUrl}
                        alt={user.name || ''}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                    />
                </div>
            ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full 
                flex items-center justify-center transform group-hover:scale-105 transition-all">
                    <span className="text-purple-600 text-lg font-semibold">
                        {user?.name?.[0] || user?.email?.[0] || '?'}
                    </span>
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                    {user?.name || 'ユーザー'}
                </div>
                <div className="text-sm text-gray-500 truncate">
                    {user?.email}
                </div>
            </div>
        </Link>
    );
}