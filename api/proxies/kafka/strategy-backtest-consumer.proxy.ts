import * as kafka from 'kafka-node';
import * as rx from 'rxjs';

import * as api from '../../../api';

export class StrategyBacktestConsumerProxy {

    constructor(private topicName: string) {
    }

    public createTopic() {
        return new Promise(async (resolve, reject) => {
            const client = new kafka.KafkaClient({
                kafkaHost: api.shared.Config.settings.kafka_conn_string,
            });

            const producer = new kafka.Producer(client);
            // Create topics sync
            producer.on('ready', () => {
                producer.createTopics([this.topicName], false, (err, data) => {
                    if (err) { return reject(err); }
                    console.log(data);
                    resolve(true);
                });
            });
        });
    }
    // public retrieveEventsFromOffset(offset): Promise<api.models.StrategyEventDocument[]> {
    //     let events: api.models.StrategyEventDocument[] = [];
    //     return new Promise((resolve, reject) => {
    //         let client = new kafka.KafkaClient({
    //             kafkaHost: api.shared.Config.settings.kafka_conn_string,
    //         });

    //         let offsetHandler = new kafka.Offset(client);
    //         let self = this;
    //         let lastOffset;
    //         offsetHandler.fetchLatestOffsets([this._topicName], (error, offsets) => {
    //             if (error && error.message === "Topic(s) does not exist") {
    //                 return resolve([]);
    //             } else if (error) {
    //                 return reject(error);
    //             }
    //             let partition = 0;
    //             console.log(offsets[this._topicName][partition]);
    //             lastOffset = offsets[this._topicName][partition];

    //             let consumer = new kafka.Consumer(
    //                 client, [
    //                     { topic: this._topicName, offset: offset },
    //                 ], {
    //                     autoCommit: true,
    //                     fromOffset: true,
    //                 },
    //             );

    //             consumer.on('message', (message: any) => {
    //                 if (message && message.value) {
    //                     let item = JSON.parse(message.value);
    //                     events.push(item);
    //                     if (events.length === lastOffset) {
    //                         resolve(events);
    //                     }
    //                 }
    //             });
    //             consumer.on('error', (err: string) => {
    //                 console.log(err);
    //                 reject(err);
    //             });
    //         });
    //     });
    // }

    public subscribe(count) {
        return new rx.Observable<api.models.StrategyEventDocument[]>((x) => {
            let items: any[] = [];
            const client = new kafka.KafkaClient({
                kafkaHost: api.shared.Config.settings.kafka_conn_string,
            });

            const consumer = new kafka.Consumer(
                client, [
                    { topic: this.topicName, offset: 0 },
                ], {
                    autoCommit: true,
                    fromOffset: true,
                },
            );

            consumer.on('message', async (message: any) => {
                if (message && message.value) {
                    const item = JSON.parse(message.value);
                    items.push(item);
                }
                if (items.length >= count) {
                    console.log('NEXT is gonna called');
                    x.next(items);
                    items = [];
                }
            });
            consumer.on('error', (err: string) => {
                console.log(err);
                x.error(err);
            });
        });
    }
}