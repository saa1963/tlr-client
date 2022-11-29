import {stringUtils} from './stringutils'

describe('stringUtils', () => {
    describe.each(
            [
            ["dsvdg","fa40eac6ad7459defdfbf83a80fc3997"],
            ["HJDRZsvwMr9UtsytTfOcDYf6","fb38e881c7c5b9d0395de5a9d10aec66"],
            ["merodb","192130175d896ea579af6cb58e2e3b28"],
            ["gucO1","67fee702e7ce9b4d4757aadc9ee43435"],
            ["l_eden_l","c8dfefd34acd40e47d1a90aa1aa5d852"],
            ["cCE","d18293785b5b8cc3649495a5a297ba80"],
            ["Juriik","6e7647e151320d3d0d7ed7d5be2623a6"],
            ["H1o","ddb772c5d4df3ea30dca67fdef688e43"],
            ["fullmaple","b93cb94a82fd55c1e6c59e7b7ae9901c"],
            ["AugGmOZEgJfwBGOeWxo64V","6ea44a057d0ec53d61ea83fbf2d1f9f7"],
            ["kryptonite1226","3ab8ecabdd3416fd62c85b79eff29ff8"],
            ["OeyM","f025f0080dbbe36189d31effaed63f6f"],
            ["MC123","23e66908c4afb0bef4e0f8f790b2feeb"],
            ["Aqe8Fdey5M9J5wUK3g","05f74c3bcb6c1c74ade0490a4738a345"],
            ["Someorg","13b0407131ae83ee80c5ecd5e992c704"],
            ["cikBPcQwjBzUP","c9e7d4e3cac7485e4428df0b5d238fa3"],
            ["killspence","b4eaabdc4062dd355e457b8af8209584"],
            ["LlFdU8gkPumUPOHu2Y84riI","fe7d66e2239b89c94cf428dce1abf3df"],
            ["shooting","7b49993fa97555a00841cc95bee6bf70"],
            ["lafDAw","0d158b0b4948f723486f28fa995824ea"],
            ["Cephalotripsy","bf24272c44db5d962e78139059e9c99a"],
            ["XUjYfoLdnSVndjOPCMeHXDo3s","23a2bb5633417112a69013db09d5f94b"],
            ["triplestar","3d419dea4cd9205120cdcdb00e917fef"],
            ["jnoFpWSsNrlKY","4109ddda03cef4168c0a55573a5939c7"],
            ["off2seeyourmother","ed8050ee7a3ae060e19b20392f2d97cf"],
            ["x21Ww","b5426f0fc4069b567d7216705ee0d621"],
            ["sleekparrot","a261a4cb9885992d463d9fec19692cdb"],
            ["caR","2212acec9259249f71295013b3eef0ba"],
            ["Popnetic","5a34e013e5da027013ffaa24c3537486"],
            ["MsswOMj4Tq9hICHbqy4Cwwa","0a3c88a1f28da1d265326e7251a5a38b"],
            ["", "d41d8cd98f00b204e9800998ecf8427e"]
            ])('MD5', (a, expected) => {
                test(`return ${expected}`, () => {
                    expect(stringUtils.md5(a)).toBe(expected)
                })
            })
});