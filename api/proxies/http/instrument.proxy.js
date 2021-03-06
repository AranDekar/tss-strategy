"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const api = require("../../../api");
const proxies = require("../../proxies");
class InstrumentProxy extends proxies.BaseProxy {
    constructor() {
        super(api.shared.Config.settings.instruments_base_path);
    }
    /*
      * gets limited number of events of an instrument
      * @param instrument the instrument of the candles
      * @param candleTime if provided, the limited number of events are returned where their candle
      * time is greater than this
      * @param events a comma separated list of events that are required to return
      */
    getEvents(instrument, candleTime, events) {
        const localVarPath = this.basePath + '/instruments/{instrument}/events'
            .replace('{' + 'instrument' + '}', String(instrument));
        const queryParameters = {};
        const headerParams = Object.assign({}, this.defaultHeaders);
        const formParams = {};
        // verify required parameter 'instrument' is not null or undefined
        if (instrument === null || instrument === undefined) {
            throw new Error('Required parameter instrument was null or undefined when calling getEvents.');
        }
        if (candleTime !== undefined) {
            queryParameters.candleTime = candleTime;
        }
        if (events !== undefined) {
            queryParameters.events = events;
        }
        const useFormData = false;
        const requestOptions = {
            method: 'GET',
            qs: queryParameters,
            headers: headerParams,
            uri: localVarPath,
            useQuerystring: this.useQuerystring,
            json: true,
        };
        this.authentications.api_key.applyToRequest(requestOptions);
        this.authentications.default.applyToRequest(requestOptions);
        if (Object.keys(formParams).length) {
            if (useFormData) {
                requestOptions.formData = formParams;
            }
            else {
                requestOptions.form = formParams;
            }
        }
        return new Promise((resolve, reject) => {
            request(requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else {
                    if (response.statusCode >= 200 && response.statusCode <= 299) {
                        resolve({ response, body });
                    }
                    else {
                        reject({ response, body });
                    }
                }
            });
        });
    }
}
exports.InstrumentProxy = InstrumentProxy;
//# sourceMappingURL=instrument.proxy.js.map