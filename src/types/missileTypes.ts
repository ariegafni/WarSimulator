// missileTypes.ts:
export interface Missile {
    name : string;
    amount : number;
    description?: string;
    speed? : number;
};
export interface LaunchedMissile {
    id : string;
    name : string;
    sourceOrg : string;
    targetArea : string;
    launchTime : number;
    missileSpeed : number;
    TimeToHit : number;
    status : 'launched' | 'hit' | 'intercepted';
}
export interface AttackState {
    missiles : Missile[];
    launchedMissiles : LaunchedMissile[];
    isLoading : boolean;
    error : string | null;
    
}

export interface LaunchRequest{
    missileName : string;
    targetArea : string;
    sourceOrg : string;
}
