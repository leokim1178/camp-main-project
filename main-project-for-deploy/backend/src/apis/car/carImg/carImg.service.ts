import { Storage } from '@google-cloud/storage';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'graphql-upload';

import { v4 as uuidv4 } from 'uuid';

import { getToday } from 'src/commons/libraries/utils';
import { Repository } from 'typeorm';
import { CarCustom } from '../carCustom/entities/carCustom.entity';
import { CarImg } from './entities/carImg.entity';

interface ICarImg {
    imgs: FileUpload[];
}

@Injectable()
export class CarImgService {
    constructor(
        @InjectRepository(CarImg)
        private readonly carImgRepository: Repository<CarImg>,
        @InjectRepository(CarCustom)
        private readonly carCustomRepository: Repository<CarCustom>,
    ) {}

    async upload({ imgs }: ICarImg) {
        const storage = new Storage({
            keyFilename: process.env.STORAGE_KEY_FILENAME,
            projectId: process.env.STORAGE_PROJECT_ID,
        }).bucket(process.env.STORAGE_BUCKET);
        const waitedImgs = await Promise.all(imgs);

        const results = await Promise.all(
            waitedImgs.map((el) => {
                return new Promise((resolve, reject) => {
                    const imgName = `${getToday()}/${uuidv4()}/origin/${
                        el.filename
                    }`;
                    el.createReadStream()
                        .pipe(storage.file(imgName).createWriteStream())
                        .on('finish', () =>
                            resolve(`${process.env.STORAGE_BUCKET}/${imgName}`),
                        )
                        .on('error', () => reject());
                });
            }),
        );

        return results;
    }

    async create({ carCustomId, imgURLs }) {
        const carCustom = await this.carCustomRepository.findOne({
            where: { id: carCustomId },
        });

        const result = await imgURLs.map(async (el) => {
            return await this.carImgRepository.save({ imgURL: el, carCustom });
        });

        return result;
    }
    async updateImg({ carCustomId, imgURLs }) {
        //1. carCustomId가 유효한지 확인
        const carCustom = await this.carCustomRepository.findOne({
            where: { id: carCustomId },
        });
        if (!carCustom)
            throw new UnprocessableEntityException(
                '등록되지 않은 carCustomId 입니다',
            );
        //2. carCustomId에 해당되는 이미지들 불러오기
        const carCustomURLs = await this.carImgRepository.find({
            where: { carCustom: carCustomId },
        });

        //3. carCustomId와 연결된 이미지 중 저장할 항목과 삭제할 항목 분리
        const newURLsArray = []; // 새롭게 저장해야하는 url들
        const pastURLs = []; //  이미 존재했던 url들

        for (let i = 0; i < imgURLs.length; i++) {
            await Promise.all(
                carCustomURLs.map(async (el) => {
                    if (el.imgURL === imgURLs[i]) {
                        newURLsArray.push(el.imgURL);
                    } else {
                        pastURLs.push(el.imgURL);
                    }
                }),
            );
        }

        // 저장할 항목( 입력한 url들 - 새롭게 저장해야하는 url들 )
        const newURLs = imgURLs.filter((el) => {
            return !newURLsArray.includes(el);
        });
        // 삭제할 항목( 이미 존재했던 url들 - 새롭게 저장해야하는 url들 )
        const forDelete = [
            // 중복 제거
            ...new Set(
                pastURLs.filter((el) => {
                    return !newURLsArray.includes(el);
                }),
            ),
        ];

        // 4. 새로운 url들 저장
        await Promise.all(
            newURLs.map(async (el) => {
                return await this.carImgRepository.save({
                    carCustom,
                    imgURL: el,
                });
            }),
        );

        // 5. 삭제할 url들 삭제
        await Promise.all(
            forDelete.map(async (el) => {
                return await this.carImgRepository.delete({
                    carCustom,
                    imgURL: el,
                });
            }),
        );

        // 6. carCustom에 해당되는 이미지 다시 추출 후 전송

        const saveResult = await this.carImgRepository.find({
            where: { carCustom },
            relations: ['carCustom'],
        });

        return saveResult;
    }
}
