import React from 'react';

export function Test() {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">TailwindCSS Test</h1>
      <div className="bg-red-500 p-4 rounded-lg mb-4">
        <p className="text-lg">Nếu bạn thấy màu đỏ và xanh, TailwindCSS đã hoạt động!</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500 p-4 rounded">Green</div>
        <div className="bg-yellow-500 p-4 rounded">Yellow</div>
        <div className="bg-purple-500 p-4 rounded">Purple</div>
      </div>
      <button className="mt-4 bg-white text-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
        Test Button
      </button>
    </div>
  );
}
