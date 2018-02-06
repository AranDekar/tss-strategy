import { Document, Schema, Model } from 'mongoose';
import * as api from '../../api';

const mongoose = api.shared.DataAccess.mongooseInstance;
export interface StrategySnapshot {
    topic: string;
    time: number;
    payload: any;
}
export interface StrategySnapshotDocument extends StrategySnapshot, Document {
}
export interface StrategySnapshotDocumentOperations extends Model<StrategySnapshotDocument> {
    findLastBacktestSnapshot(topic: string): Promise<StrategySnapshotDocument>;
    findLastLiveSnapshot(topic: string): Promise<StrategySnapshotDocument>;
}

const schema = new Schema({
    topic: { type: String },
    time: { type: Number },
    payload: { type: Schema.Types.Mixed },
});

schema.statics.findLastBacktestSnapshot = async (topic: string) => {
    return strategyBacktestSnapshotModel
        .findOne({ topic })
        .sort({ time: -1 })
        .exec();
};
schema.statics.findLastLiveSnapshot = async (topic: string) => {
    return strategyLiveSnapshotModel
        .findOne({ topic })
        .sort({ time: -1 })
        .exec();
};

export const strategyLiveSnapshotModel = mongoose.model<StrategySnapshotDocument>(
    'strategy_live_snapshot', schema) as StrategySnapshotDocumentOperations;
export const strategyBacktestSnapshotModel = mongoose.model<StrategySnapshotDocument>(
    'strategy_backtest_snapshot', schema) as StrategySnapshotDocumentOperations;
