#!/usr/bin/env node

/**
 * Build script for Hostinger frontend deployment
 * 
 * This script:
 * 1. Installs dependencies in client/
 * 2. Builds React app in client/
 * 3. Copies client/build to root/build
 * 
 * Usage: node scripts/build-client.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Building frontend for Hostinger deployment...\n');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const clientDir = path.join(rootDir, 'client');
const clientBuildDir = path.join(clientDir, 'build');
const rootBuildDir = path.join(rootDir, 'build');

try {
  // Step 1: Check if client directory exists
  console.log(`📁 Checking client directory: ${clientDir}`);
  if (!fs.existsSync(clientDir)) {
    throw new Error(`❌ Client directory not found at ${clientDir}`);
  }
  console.log('✅ Client directory found\n');

  // Step 2: Install dependencies in client/
  console.log('📦 Installing dependencies in client/...');
  execSync('npm install', {
    cwd: clientDir,
    stdio: 'inherit',
    shell: true
  });
  console.log('✅ Dependencies installed\n');

  // Step 3: Build React app
  console.log('🏗️  Building React app...');
  execSync('npm run build', {
    cwd: clientDir,
    stdio: 'inherit',
    shell: true
  });
  console.log('✅ React app built\n');

  // Step 4: Check if client/build exists
  console.log(`📁 Checking client build output: ${clientBuildDir}`);
  if (!fs.existsSync(clientBuildDir)) {
    throw new Error(`❌ Client build directory not found at ${clientBuildDir}`);
  }
  console.log('✅ Client build directory found\n');

  // Step 5: Remove existing root build directory
  console.log(`🗑️  Removing existing root build directory: ${rootBuildDir}`);
  if (fs.existsSync(rootBuildDir)) {
    fs.rmSync(rootBuildDir, { recursive: true, force: true });
    console.log('✅ Old build directory removed\n');
  } else {
    console.log('ℹ️  No existing build directory to remove\n');
  }

  // Step 6: Copy client/build to root/build
  console.log(`📋 Copying client/build to root/build...`);
  fs.cpSync(clientBuildDir, rootBuildDir, { recursive: true });
  console.log('✅ Build copied to root/build\n');

  // Step 7: Verify build output
  console.log('✔️  Verifying build output...');
  const indexHtmlPath = path.join(rootBuildDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    console.log(`✅ build/index.html exists\n`);
  } else {
    throw new Error(`❌ build/index.html not found after copy`);
  }

  console.log('🎉 Frontend build complete!\n');
  console.log('📂 Build output location: root/build/');
  console.log('📄 Entry file: root/build/index.html\n');

} catch (error) {
  console.error(`\n❌ Build failed: ${error.message}\n`);
  process.exit(1);
}
