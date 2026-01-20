        </Tabs>

        {/* 数据标注模态框 */}
        {showAnnotationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  添加备注
                </h3>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注内容
                </label>
                <textarea
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                  placeholder="请输入备注信息，例如：目标调整为1428万元，因为..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                  rows={4}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAnnotationModal(false);
                      setCurrentAnnotationKey('');
                      setAnnotationText('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      setAnnotations(prev => ({
                        ...prev,
                        [currentAnnotationKey]: annotationText
                      }));
                      setShowAnnotationModal(false);
                      setCurrentAnnotationKey('');
                      setAnnotationText('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    保存备注
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
