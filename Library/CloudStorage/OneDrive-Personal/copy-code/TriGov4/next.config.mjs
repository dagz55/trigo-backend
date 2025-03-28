let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ignoreDuringBuilds: true, // Temporarily disable
  },
  typescript: {
    // ignoreBuildErrors: true, // Temporarily disable
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // webpackBuildWorker: true, // Temporarily disable
    // parallelServerBuildTraces: true, // Temporarily disable
    // parallelServerCompiles: true, // Temporarily disable
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
