import React, { useEffect, useState } from 'react';
import { instance } from '../../api/instance';

const CharacterPage = () => {
    const [character, setCharactor] = useState({
        character_name: "",

    });

    const endpoints = [
        'basic', //기본 
        'popularity', //인기도 
        'stat', //종합 능력치
        'hyper-stat', //하이퍼스탯
        'propensity', //성향
        'ability',  //어빌리티
        'item-equipment', //장착 장비
        'cashitem-equipment', //장착 캐시 장비
        'symbol-equipment', //장착 심볼
        'set-effect',   //적용 세트 효과
        'beauty-equipment', //장착 헤어,성형,피부
        'android-equipment', //장착 안드로이드
        'pet-equipment', //장착 펫
        'skill', //스킬 --
        'link-skill', //장착 링크 스킬
        'vmatrix', //V매트릭스
        'hexamatrix', //HEXA코어 
        'hexamatrix-stat', //HEXA매트릭스 설정 HEXA스탯
        'dojang', //무릉 최고 기록
    ];

    // 조회하고자 하는 전직 차수
        // 0: 0차 스킬 및 제로 공용스킬
        // 1: 1차 스킬
        // 1.5: 1.5차 스킬
        // 2: 2차 스킬
        // 2.5: 2.5차 스킬
        // 3: 3차 스킬
        // 4: 4차 스킬 및 제로 알파/베타 스킬
        // hyperpassive: 하이퍼 패시브 스킬
        // hyperactive: 하이퍼 액티브 스킬
        // 5: 5차 스킬
        // 6: 6차 스킬
    const skillOptions = [
        'hyperpassive',
        'hyperactive',
        '5',
        '6',
    ];

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

        const promises = endpoints.map(endpoint => {
            if (endpoint === 'skill') {
                const skillPromises = skillOptions.map(skillOption => 
                    instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/character/${endpoint}?ocid=${ocid}&date=${today}&character_skill_grade=${skillOption}`, {
                        headers: {
                            "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
                        },
                    })
                );
                return Promise.all(skillPromises);
            } else {
                return instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/character/${endpoint}?ocid=${ocid}&date=${today}`, {
                    headers: {
                        "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
                    },
                });
            }
        });
        
        const results = await Promise.all(promises);
        
        const resultObjects = results.map((result, index) => {
            if (endpoints[index] === 'skill') {
                const skillResults = result.map((res, i) => ({
                    key: skillOptions[i],
                    value: res.data
                }));
                return {
                    key: endpoints[index],
                    value: skillResults
                };
            } else {
                return {
                    key: endpoints[index],
                    value: result.data
                };
            }
        });
        
        console.log(resultObjects);
        

        //setCharactor({...character, oguild_id:response.data.oguild_id });
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