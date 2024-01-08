import React, { useEffect, useState } from 'react';
import { instance } from '../../api/instance';
import { today, todayPluse } from '../../common/fn-js/date';

const CharacterPage = () => {
    const [search, setSearch] = useState({
        character_name: "",
    });
    const [character, setCharactor] = useState({
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
        const two_days_ago = todayPluse(-2);
        //오늘 날짜를 불러오면 에러나서 2이전 날짜로

        const response = await instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/id?character_name=${search.character_name}`, {
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
                    instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/character/${endpoint}?ocid=${ocid}&date=${two_days_ago}&character_skill_grade=${skillOption}`, {
                        headers: {
                            "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
                        },
                    })
                );
                return Promise.all(skillPromises);
            } else {
                return instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/character/${endpoint}?ocid=${ocid}&date=${two_days_ago}`, {
                    headers: {
                        "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
                    },
                });
            }
        });

        const results = await Promise.all(promises);

        const resultObjects = results.map((result, index) => {
            const key = endpoints[index];
            const value = (key === 'skill')
                ? skillOptions.reduce((acc, skillOption, i) => ({ ...acc, [skillOption]: result[i].data }), {})
                : result.data;

            return { [key]: value };
        });

        const combinedObject = Object.assign({}, ...resultObjects);

        setCharactor(combinedObject);
    }
    const fetchRankingPage = async (page) => {

        const response = await instance.get(`${process.env.REACT_APP_MAPLE_BASE_URL}/maplestory/v1/ranking/overall?date=${today}&page=${page}`, {
            headers: {
                "x-nxopen-api-key": process.env.REACT_APP_MAPLE_KEY
            },
        });

        const ranking = response.data.ranking;
        return { ranking };
    }

    const totalPages = 2980; // 원하는 페이지 수
    const perPage = 500;

    const apiRequestBundle = (total, bundleValue) => {
        const bundles = [];
        for (let i = 0; i < total; i += bundleValue) {
            bundles.push(i + bundleValue > total ? total : i + bundleValue);
        }
        return bundles;
    }

    const fetchAllRankingPages = async () => {
        try {
            const apiBundles = apiRequestBundle(totalPages, perPage);

            console.log(apiBundles);
            const pageNumbers = apiBundles.map((subArray, index) => {
                const start = index * perPage + 1;
                const end = subArray;
                return Array.from({length: end - start + 1}, (_, index) => start + index);
            });
            console.log(pageNumbers);

            //타이머 초당 500건씩 api호출하기 위해
            let index = 0;
            let intervalId = setInterval(async () => {
                console.log(index);
                const promises = pageNumbers.map(page => fetchRankingPage(page));
                const results = await Promise.all(promises);
                
                index++;
                console.log(pageNumbers);
            }, 1000);

            setTimeout(function () {
                clearInterval(intervalId);
                console.log("setInterval 중지");
            }, (1000 * (apiBundles.length))); // 10000밀리초(10초) 후에 중지


            const rankTotal = results.length;

            

            // console.log("몫:", quotient); // 출력: 5
            // console.log("나머지:", remainder); // 출력: 480
            // console.log("dd:", dd); // 출력: 480
            // const promises = pageNumbers.map(page => fetchRankingPage(page));
            // const results = await Promise.all(promises);
            // const totalPages = results.length;
            // const perPage = 500;

            // //const test = Array.from({ length: totalPages }, (_, index) => results[index]);
            // const combinedArray = results.reduce((acc, current) => {
            //     acc.ranking.push(...current.ranking);
            //     return acc;
            // }, { ranking: [] });

            // const quotient = Math.floor(totalPages / perPage);
            // const remainder = totalPages % perPage;

            // const paging = Array.from({ length: quotient }, (_, index) => (index + 1) * perPage);
            // if (remainder !== 0) {
            //     paging.push(
            //         paging.length === 0 ? remainder :
            //         paging[paging.length - 1] + remainder
            //     );
            // }

            // console.log('All ranking pages:', results);
            // console.log('totalPages:', combinedArray);
        } catch (error) {
            console.error('Error fetching ranking pages:', error);
        }
    };

    useEffect(() => {
        console.log(character);
    }, [character])

    return (
        <div>
            <input type='text' name='character_name' value={search.character_name || ""} onChange={(e) => setSearch({ ...search, [e.target.name]: e.target.value })} />
            <button onClick={get_character_info}>캐릭터 정보 가져오기</button><br />
            <button onClick={fetchAllRankingPages}>캐릭터 랭킹 검색</button>
        </div>
    );
};

export default CharacterPage;