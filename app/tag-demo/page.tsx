'use client';

import React, { useState } from 'react';
import TagInput from '../components/TagInput';

export default function TagDemo() {
  const [basicTags, setBasicTags] = useState<string[]>(['react', 'typescript']);
  const [limitedTags, setLimitedTags] = useState<string[]>([]);
  const [duplicateTags, setDuplicateTags] = useState<string[]>(['javascript']);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Tag Input Component Demo
        </h1>
        
        <div className="space-y-8">
          {/* Basic Tag Input */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Tag Input
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add tags using Enter key or commas. No duplicates allowed.
            </p>
            <TagInput
              tags={basicTags}
              onTagsChange={setBasicTags}
              placeholder="Add your tags here..."
            />
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current tags:
              </h3>
              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                {JSON.stringify(basicTags, null, 2)}
              </pre>
            </div>
          </div>

          {/* Limited Tag Input */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Limited Tag Input (Max 5)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This input has a maximum of 5 tags.
            </p>
            <TagInput
              tags={limitedTags}
              onTagsChange={setLimitedTags}
              placeholder="Add up to 5 tags..."
              maxTags={5}
            />
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current tags:
              </h3>
              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                {JSON.stringify(limitedTags, null, 2)}
              </pre>
            </div>
          </div>

          {/* Allow Duplicates */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Allow Duplicates
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This input allows duplicate tags.
            </p>
            <TagInput
              tags={duplicateTags}
              onTagsChange={setDuplicateTags}
              placeholder="Duplicates allowed..."
              allowDuplicates={true}
            />
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current tags:
              </h3>
              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                {JSON.stringify(duplicateTags, null, 2)}
              </pre>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              How to Use
            </h2>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>• Type a tag and press <kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">Enter</kbd> to add it</li>
              <li>• Use commas to add multiple tags at once: "tag1, tag2, tag3"</li>
              <li>• Click the × button on any tag to remove it</li>
              <li>• Press <kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">Backspace</kbd> on empty input to remove the last tag</li>
              <li>• Tags are automatically added when the input loses focus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}