/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      '127.0.0.1', // For local development
      'localhost',
      'tkmkfsbxjnzifeirpomt.supabase.co' // Your Supabase project domain
    ],
  },
  // ...existing code...
}

module.exports = nextConfig