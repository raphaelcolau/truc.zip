import React, {useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Square from './Square';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSpeedUp } from '../../store/three-store';

export default function CanvasBackground() {
  const [squaresData] = useState(() =>
    Array.from({ length: 70 }).map((_, index) => ({
      key: index,
      position: [
        Math.random() * 14 - 7,
        Math.random() * 14 - 7,
        Math.random() * 4 - 2,
      ],
      repulsionForce: 5,
    }))
  );
  const dispatch = useDispatch();
  const isSpeedUp = useSelector((state) => state.isSpeedUp);

  useEffect(() => {
    const handleMouseDown = (event) => {
      dispatch(setIsSpeedUp(true));
    };

    const handleMouseUp = () => {
      dispatch(setIsSpeedUp(false));
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  return (
    <div className="page">
      <Canvas className="three__Canvas">
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {squaresData.map((squareData) => (
          <Square
            key={squareData.key}
            index={squareData.key}
            position={squareData.position}
            repulsionForce={squareData.repulsionForce}
            isSpeedUp={isSpeedUp}
          />
        ))}
      </Canvas>
    </div>
  );
} 