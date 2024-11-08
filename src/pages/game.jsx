import React from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';

const Game =() => {

    const { userInfo: user, accessToken } = useRecoilValue(userState);

    const userId = user?.id;
    
    return (
        <div>
            <iframe
                src="https://girl-catcher-game.netlify.app/?userId=${userId}"
                className="w-full h-[730px] border"
                title="Flutter Web App"
            />
        </div>
    );
};

export default Game