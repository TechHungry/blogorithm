// Now let's create an unauthorized page
// src/app/unauthorized/page.tsx
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import {Footer} from "@/components/Footer";
import {routes} from "@/app/resources/config";
import React from "react";

export default function UnauthorizedPage() {
    return (
        <>
            <Navbar routes={routes}/>
            <div className="flex items-center my-auto justify-around">
                <div className="p-6 bg-gray-800 rounded shadow-md text-center ">
                    <h1 className="text-2xl font-bold mb-4 text-red-500">Unauthorized Access</h1>
                    <p className="mb-4">You need a valid token to access the write page.</p>
                    <Link href="/" className="text-blue-500 hover:underline">
                        Return to Home
                    </Link>
                </div>
            </div>
            <Footer/>
        </>
    );
}