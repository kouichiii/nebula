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
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
        >
            {user?.iconUrl ? (
            <Image
                src={user.iconUrl}
                alt={user.name || ''}
                width={40}
                height={40}
                className="rounded-full"
            />
            ) : (
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-lg font-semibold">
                {user?.name?.[0] || user?.email?.[0] || '?'}
                </span>
            </div>
            )}
            <div>
            <div className="font-medium text-gray-900">
                {user?.name || 'ユーザー'}
            </div>
            <div className="text-sm text-gray-500">
                {user?.email}
            </div>
            </div>
      </Link>
    );
}