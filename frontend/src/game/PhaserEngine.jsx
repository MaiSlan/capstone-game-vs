import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import MainScene from './scenes/MainScene';
import UIScene from './scenes/UIScene';
import CharacterSelectScene from './scenes/CharacterSelectScene';
import MainTitleScene from './scenes/MainTitleScene';

export default function PhaserEngine({ selectedCharacter, userUpgrades }) {
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
      },
      scene: [PreloadScene, MainTitleScene, CharacterSelectScene, MainScene, UIScene]
    };

    const game = new Phaser.Game(config);

    // After the game is ready, tell the PreloadScene to start
    game.events.once('ready', () => {
      game.scene.start('PreloadScene', { 
        character: selectedCharacter, 
        userUpgrades: userUpgrades || [] 
      });
    });

    return () => {
      game.destroy(true);
    };
  }, []); // Empty dependencies because we handle re-starts via key={gameInstanceKey} in PlayArea

  return <div ref={gameRef} className="w-full h-full" />;
}