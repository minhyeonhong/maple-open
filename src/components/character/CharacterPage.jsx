import React, { useEffect, useState } from 'react';
import { instance } from '../../api/instance';

const CharacterPage = () => {
    const [character, setCharactor] = useState({
        character_name: "",

    });

    const get_character_info = async () => {
        const today = getFormattedDate();
        const response = await instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/id?character_name=${character.character_name}`, {
            headers: {
                "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
            },
        });

        if (response.status !== 200) {
            alert('캐릭터 정보 없음');
            return;
        }

        const ocid = response.data.ocid;
        const chracterInfo = await instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/character/basic?ocid=${ocid}&date=${today}`, {
            headers: {
                "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
            },
        });

        //setCharactor({...character, oguild_id:response.data.oguild_id });

        console.log(chracterInfo);
    }

    const getFormattedDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
        let day = today.getDate();

        // 한 자리 수인 경우 앞에 0을 추가해주기
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        const formattedDate = year + '-' + month + '-' + day;

        const date = new Date(formattedDate);
        date.setDate(date.getDate() - 2);
        return date.toISOString().slice(0, 10);
    }

    useEffect(() => {
        //        setCharactor({ ...character, today: getFormattedDate() });
    }, [character])

    return (
        <div>
            <input type='text' name='character_name' value={character.character_name || ""} onChange={(e) => setCharactor({ ...character, [e.target.name]: e.target.value })} />
            <button onClick={get_character_info}>캐릭터 정보 가져오기</button>
        </div>
    );
};

export default CharacterPage;