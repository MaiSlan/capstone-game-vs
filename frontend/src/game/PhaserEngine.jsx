import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MainScene from './scenes/MainScene';
import UIScene from './scenes/UIScene';

export default function PhaserEngine({ selectedCharacter }) {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: gameRef.current,
        width: '100%',
        height: '100%'
      },
      physics: {
        default: 'arcade',
        arcade: { debug: false }
      }
    };

    const game = new Phaser.Game(config);
    game.events.once('ready', () => {
      game.scene.add('PreloadScene', PreloadScene);
      game.scene.add('MainScene', MainScene);
      game.scene.add('UIScene', UIScene);
      game.scene.start('PreloadScene', { character: selectedCharacter });
    });

    return () => {
      game.destroy(true);
    };
  }, [selectedCharacter]);

  return <div ref={gameRef} className="w-full h-full" />;
}