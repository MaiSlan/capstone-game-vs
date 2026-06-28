// src/game/managers/WeaponManager.js

// Viking
import BouncingAxe from '../weapons/viking/BouncingAxe';
import PiercingLance from '../weapons/viking/PiercingLance';
import SeismicStomp from '../weapons/viking/SeismicStomp';
import DragonShout from '../weapons/viking/DragonShout';

// Pirate
import Musket from '../weapons/pirate/Musket';
import Molotov from '../weapons/pirate/Molotov';
import TreasureShovel from '../weapons/pirate/TreasureShovel';
import LoadedDice from '../weapons/pirate/LoadedDice';

// Berserker
import IronSlab from '../weapons/berserker/IronSlab';
import FanOfKnives from '../weapons/berserker/FanOfKnives';
import TrailGrenades from '../weapons/berserker/TrailGenades';
import ArmCannon from '../weapons/berserker/ArmCannon';

// Paladin
import ShieldBash from '../weapons/paladin/ShieldBash';
import HolyBroadsword from '../weapons/paladin/HolyBroadsword';
import ConsecratedGround from '../weapons/paladin/ConsecratedGround';
import SpinningCross from '../weapons/paladin/SpinningCross';

// Witch
import MagicOrb from '../weapons/witch/MagicOrb';
import MagicBook from '../weapons/witch/MagicBook';
import ArcaneNova from '../weapons/witch/ArcaneNova';
import MagicWand from '../weapons/witch/MagicWand';

// Drifter
import MeteoriteBlade from '../weapons/drifter/MeteoriteBlade';
import PhantomStrike from '../weapons/drifter/PhantomStrike';
import ChillingAura from '../weapons/drifter/ChillingAura';
import ConjunctionSphere from '../weapons/drifter/ConjunctionSphere';

const WEAPON_REGISTRY = {
  'bouncing_axe': BouncingAxe, 'piercing_lance': PiercingLance, 'seismic_stomp': SeismicStomp, 'dragon_shout': DragonShout,
  'musket': Musket, 'molotov': Molotov, 'treasure_shovel': TreasureShovel, 'loaded_dice': LoadedDice,
  'iron_slab': IronSlab, 'fan_of_knives': FanOfKnives, 'trail_grenades': TrailGrenades, 'arm_cannon': ArmCannon,
  'shield_bash': ShieldBash, 'holy_broadsword': HolyBroadsword, 'consecrated_ground': ConsecratedGround, 'spinning_cross': SpinningCross,
  'magic_orb': MagicOrb, 'magic_book': MagicBook, 'arcane_nova': ArcaneNova, 'magic_wand': MagicWand,
  'meteorite_blade': MeteoriteBlade, 'phantom_strike': PhantomStrike, 'chilling_aura': ChillingAura, 'conjunction_sphere': ConjunctionSphere
};

export default class WeaponManager {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.weapons = [];
    this.maxWeapons = 5;
  }

  addOrUpgradeWeapon(weaponId) {
    const existingWeapon = this.weapons.find(w => w.id === weaponId);
    
    if (existingWeapon) {
      if (existingWeapon.level < 5) existingWeapon.level++;
    } else if (this.weapons.length < this.maxWeapons) {
      const WeaponClass = WEAPON_REGISTRY[weaponId];
      if (WeaponClass) {
        this.weapons.push({ 
          id: weaponId, 
          level: 1,
          instance: new WeaponClass(this.scene) 
        });
      } else {
        console.warn(`Weapon ID ${weaponId} not found in WEAPON_REGISTRY.`);
      }
    }
  }

  // Used to send clean data to the React UI
  getCleanWeaponData() {
    return this.weapons.map(w => ({ id: w.id, level: w.level }));
  }

  update(time, enemiesGroup) {
    this.weapons.forEach(weapon => {
      if (weapon.instance && typeof weapon.instance.update === 'function') {
        weapon.instance.update(time, this.player, enemiesGroup, weapon.level);
      }
    });
  }
}