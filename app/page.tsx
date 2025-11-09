import NepaliTextArea from '@/components/NepaliTextArea';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            नेपाली युनिकोड कन्भर्टर
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Nepali Unicode Converter
          </p>
          <NepaliTextArea 
            placeholder="Type in English (e.g., mero naam ram ho) and press space after each word..."
            rows={12}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
