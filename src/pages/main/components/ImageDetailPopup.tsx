import { motion, AnimatePresence } from 'framer-motion';
import type { ImageInfo } from '../../../types/ImageCarousel';
import SplitText from '../../../components/SplitText';

interface ImageDetailPopupProps {
  isOpen: boolean;
  imageInfo: ImageInfo | null;
  onClose: () => void;
}

const ImageDetailPopup: React.FC<ImageDetailPopupProps> = ({
  isOpen,
  imageInfo,
  onClose,
}) => {
  if (!imageInfo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200,
            duration: 0.6,
          }}
          className="fixed top-0 right-0 w-1/2 h-full bg-black bg-opacity-90 backdrop-blur-sm z-50 overflow-y-auto"
          style={{
            borderLeft: '2px solid #06b6d4',
          }}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full border-2 border-cyan-400 bg-black bg-opacity-70 text-cyan-400 hover:bg-cyan-400 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center text-xl font-bold z-10"
          >
            ×
          </button>

          {/* 콘텐츠 */}
          <div className="p-8 pt-16">
            {/* 타이틀 */}
            <div className="mb-8">
              <SplitText
                text={imageInfo.title}
                className="text-4xl font-bold text-cyan-400"
                delay={50}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
              />
            </div>

            {/* 이미지 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8 rounded-lg overflow-hidden"
            >
              <img
                src={imageInfo.detailImage || imageInfo.image}
                alt={imageInfo.title}
                className="w-full h-64 object-cover"
              />
            </motion.div>

            {/* 설명 텍스트 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-white leading-relaxed"
            >
              <SplitText
                text={imageInfo.description}
                className="text-lg text-gray-300 leading-8"
                delay={30}
                duration={0.4}
                ease="power2.out"
                splitType="words"
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
              />
            </motion.div>

            {/* 추가 정보나 버튼들 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 pt-8 border-t border-cyan-400 border-opacity-30"
            >
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-cyan-400 bg-opacity-20 text-cyan-400 border border-cyan-400 rounded-lg hover:bg-opacity-30 transition-all duration-300">
                  Learn More
                </button>
                <button className="px-6 py-3 bg-transparent text-gray-400 border border-gray-400 rounded-lg hover:text-white hover:border-white transition-all duration-300">
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageDetailPopup;
