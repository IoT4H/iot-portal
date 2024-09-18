import React from 'react';



export default async function PortalLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex-auto rounded bg-white dark:bg-zinc-800 p-4 shadow max-h-full sticky top-0">
            { children}
        </div>
    );
}
