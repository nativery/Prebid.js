import { expect } from 'chai';
import { spec } from 'modules/nativeryBidAdapter';
import { newBidder } from 'src/adapters/bidderFactory.js';

const ENDPOINT = 'https://hb.nativery.com/openrtb2/auction';

describe('NativeryAdapter', function () {
  const adapter = newBidder(spec);

  describe('inherited functions', function () {
    it('exists and is a function', function () {
      expect(adapter.callBids).to.exist.and.to.be.a('function');
    });
  });

  describe('isBidRequestValid', function () {
    const bid = {
      bidder: 'nativery',
      params: {
        widgetId: 'abc123',
      },
      adUnitCode: '/adunit-code/test-path',
      bidId: 'test-bid-id-1',
      bidderRequestId: 'test-bid-request-1',
      auctionId: 'test-auction-1',
      transactionId: 'test-transactionId-1',
    };

    it('should return true when required params found', function () {
      expect(spec.isBidRequestValid(bid)).to.equal(true);
    });

    it('should return false when required params are not passed', function () {
      const invalidBid = Object.assign({}, bid);
      delete invalidBid.params.widgetId;
      expect(spec.isBidRequestValid(invalidBid)).to.equal(false);
    });
  });

  describe('buildRequests', function () {
    const bidRequests = [
      {
        bidder: 'nativery',
        params: {
          widgetId: 'abc123',
        },
        adUnitCode: '/adunit-code/test-path',
        bidId: 'test-bid-id-1',
        bidderRequestId: 'test-bid-request-1',
        auctionId: 'test-auction-1',
        transactionId: 'test-transactionId-1',
        mediaTypes: {
          banner: {
            sizes: [
              [300, 250],
              [300, 600],
            ],
          },
        },
        ortb2: {}
      },
    ];

    it('should build the request', function () {
      const request = spec.buildRequests(bidRequests, {});
      console.log(request);
      request.forEach((req) => {
        const data = JSON.parse(req.data);
        console.log('DATA', data)
        expect(req.method).to.equal('POST');
        expect(req.url).to.equal(ENDPOINT);
        expect(req.options.withCredentials).to.equal(true);
        expect(data.id).to.exist.and.to.be.a('string');
        expect(data.imp.length).to.equal(1);
      });
    });
  });

  describe('interpretResponse', function () {});
});
