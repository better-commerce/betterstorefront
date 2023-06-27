// Package Imports
import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Other Imports
import { EmptyString } from '@components/utils/constants';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || EmptyString,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || EmptyString,
        }),
    ],
    session: {
        strategy: 'jwt',
    },
};
export default NextAuth(authOptions);