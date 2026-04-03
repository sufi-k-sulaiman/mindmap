export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 text-center text-xs text-gray-600">
      <p>
        Copyright © 2026{' '}
        <a 
          href="https://1cplatform.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
        >
          1cPlatform
        </a>
        . Developed by{' '}
        <a 
          href="https://sufikhan.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
        >
          Sufi K Sulaiman
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}