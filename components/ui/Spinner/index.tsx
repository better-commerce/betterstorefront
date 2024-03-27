import React from "react";

const Spinner = () => {
    return (
        <main className="bg-white fit">
            <div className="fixed top-0 right-0 z-50 flex items-center justify-center w-screen h-screen">
                <div className="w-32 h-32 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
        </main>
    )
}

export default Spinner;