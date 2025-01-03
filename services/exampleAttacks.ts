const examples = JSON.parse(
    '[{"name":"Slap","desc":"[Name] slaps the enemy and deals [Num] damage."},{"name":"Bullet Bolt","desc":"[Name] pummels the enemy in a sea of bullets and deals [Num] damage."},{"name":"Burn","desc":"[Name] starts to burn the engulfs the enemy in flames for [Num] damage."},{"name":"Tail Snap","desc":"[Name] catches the enemy up with a vicious tail whip that deals [Num] damage."},{"name":"Amp","desc":"[Name] gives the enemy a massive charge and deals [Num] damage."},{"name":"Rave","desc":"[Name] channels a massive surge of energy which deals the enemy [Num] damage."},{"name":"Lightning","desc":"[Name] blasts the enemy with electricity and deals [Num] damage."},{"name":"Crush","desc":"[Name] chomps the enemy down until they are pulped which then deals [Num] damage."},{"name":"Sonic Boom","desc":"[Name] kicks up a sonic boom and deals [Num] damage."},{"name":"Laser","desc":"[Name] pummels the enemy in a huge laser beam that deals [Num] damage."},{"name":"Firestorm","desc":"[Name] starts to burn the enemy in a huge inferno that deals [Num] damage."},{"name":"Lightning Shock","desc":"[Name] blasts the enemy with electricity and deals [Num] damage."},{"name":"Blizzard","desc":"[Name] creates a blizzard of ice which deals the enemy [Num] damage."},{"name":"Disco Dance","desc":"[Name] throws the enemy around the stage rapidly and deals [Num] damage."},{"name":"Swarm","desc":"[Name] stings the enemy with 10 pheromones that deal [Num] damage total."},{"name":"Spitter","desc":"[Name] spits out slime from his back, which deals [Num] damage the enemy."},{"name":"Crippling Blast","desc":"[Name] buries the enemy up to their neck in sand and then blasts at them to deal [Num] damage."},{"name":"Kong","desc":"[Name] slams down on the enemy and deals [Num] damage."},{"name":"Tombstone","desc":"[Name] sends the enemy straight back to the Underworld  in a tombstone and deals [Num] damage."},{"name":"Rest","desc":"[Name] rests briefly to recover [Num] health."},{"name":"Moonlight","desc":"[Name] basks in the moonlight which heals them for [Num] health."},{"name":"Sunrise","desc":"[Name] basks in the sunrise which heals them for [Num] health."},{"name":"Cleansing Flame","desc":"[Name] ignites the enemy in a flame that deals [Num] damage. [Name] also absorbs [Num] health."},{"name":"Blessing","desc":" [Name] receives a blessing and gains 10 health."}]'
);

export default function getExampleAttack(name: string, roundNum: number) {
    const randomIndex = Math.floor(Math.random() * examples.length);
    const exampleAttack = JSON.parse(JSON.stringify(examples[randomIndex]));
    // Replace with custom params
    exampleAttack.desc = exampleAttack.desc
        .split("[Name]")
        .join(name)
        .split("[Num]")
        .join((Math.floor(Math.random() * 9) + 3) * roundNum);

    return exampleAttack;
}
