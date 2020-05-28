export const menus = [
    {
        catalogName: "待办事项",
        name: "schedule",
        catalogs: [
            {
                catalogName: "待办事项",
                go: "schedule/stay"
            }
        ]
    },
    {
        catalogName: "商家资料",
        name: "merchant",
        catalogs: [
            {
                catalogName: "基础资料",
                go: "merchant/basis",
            },
            {
                catalogName: "企业资质",
                go: "merchant/verify"
            },
            {
                catalogName: "认证资料",
                go: "merchant/identify"
            },
            {
                catalogName: "绑定设备",
                go: "merchant/bind"
            }
        ]
    },
    {
        catalogName: "人事管理",
        name: "personal",
        catalogs: [
            {
                catalogName: "员工管理",
                go: "personnel/staff"
            },
            {
                catalogName: "职位管理",
                go: "personnel/post"
            },
            {
                catalogName: "部门设置",
                go: "personnel/depart"
            },
            {
                catalogName: "工人管理",
                go: "personnel/worker"
            },
            {
                catalogName: "复用人员",
                go: "personnel/reuse"
            },
            {
                catalogName: "企业通讯录",
                go: "personnel/address"
            },
            {
                catalogName: "审批流程",
                go: "personnel/examine"
            },
            {
                catalogName:"图纸设置",
                go:"personnel/photos"

            }
        ]
    },
    {
        catalogName: "产品管理",
        name: "product",
        catalogs: [
            {
                catalogName: "产品管理",
                go: "product"
            }
        ]
    },
    {
        catalogName: "客服管理",
        name: "sales",
        catalogs: [
            {
                catalogName: "客服列表",
                go: "salecs/list"
            }
        ]
    },
    {
        catalogName: "成本管理",
        name: "cost",
        catalogs: [
            {
                catalogName: "基装管理",
                go: "temp/base"
            },
            {
                catalogName: "套装管理",
                go: "temp/meal"
            },
            {
                catalogName: "套装基装管理",
                go: "temp/mBase"
            },
            {
                catalogName: "整装管理",
                go: "temp/whole"
            },
            {
                catalogName: "整装基装管理",
                go: "temp/wBase"
            },
            {
                catalogName: "工程费系数",
                go: "cost/engineer"
            },
            {
                catalogName: "合同附件",
                go: "cost/accessory"
            },
            {
                catalogName: "设计费设置",
                go: "cost/design"
            },
            {
                catalogName: "成本核算",
                go: "cost/budget"
            },

        ]
    },
    {
        catalogName: "主材管理",
        name: "master",
        catalogs: [
            {
                catalogName: "主材列表",
                go: "master"
            }
        ]
    },
    {
        catalogName: "客户管理",
        name: "client",
        catalogs: [
            {
                catalogName: "客户列表",
                go: "client/detail"
            },
            {
                catalogName: "客户来源",
                go: "client/source"
            }
        ]
    },
    {
        catalogName: "报价管理",
        name: "offer",
        catalogs: [
            {
                catalogName: "报价列表",
                go: "offer/item"
            }
        ]
    },
    {
        catalogName: "财务管理",
        name: "finance",
        catalogs: [
            {
                catalogName: "收款管理",
                go: "finance/item"
            }
            // {
            //     catalogName:"成本核算",
            //     go:"finance/cost"
            // }
        ]
    },
    /**
     * 取消成本管理
     */
    // {
    //     catalogName:"成本管理",
    //     catalogs:[
    //         {
    //             catalogName:"整装管理",
    //             go:""
    //         }
    //     ]
    // },
    {
        catalogName: "项目管理",
        name: "article",
        catalogs: [
            {
                catalogName: "项目列表",
                go: "article/item"
            },
            {
                catalogName: "验收设置",
                go: "article/setting"
            },
            {
                catalogName: "整改通知",
                go: "article/reform"
            },
            {
                catalogName: "待审项目",
                go: "article/stay"
            },
            {
                catalogName: "增减项目",
                go: "article/regulation"
            }
        ]
    },
    {
        catalogName: "小程序案例",
        name: "case",
        catalogs: [
            {
                catalogName: "案例列表",
                go: "case/list"
            }
        ]
    },
    {
        catalogName: "项目结算",
        name: "settle",
        catalogs: [
            {
                catalogName: "工费审核",
                go: "settle/audit"
            },
            {
                catalogName: "工费结算",
                go: "settle/wage"
            }
        ]
    },
    {
        catalogName: "售后管理",
        name: "warranty",
        catalogs: [
            {
                catalogName: "保修卡审核",
                go: "warranty/audit"
            },
            {
                catalogName: "设置默认保修",
                go: "warranty/setting"
            },
            {
                catalogName: "保修记录",
                go: "warranty/record"
            }
        ]
    },
    {
        catalogName: "公告",
        name: "topic",
        catalogs: [
            {
                catalogName: "公告素材",
                go: "notice/material"
            },
            {
                catalogName: "通知列表",
                go: "notice/inform"
            },
            {
                catalogName: "考试题库",
                go: "topic/quest"
            },
            {
                catalogName: "考试列表",
                go: "topic/exam"
            }
        ]
    },
    {
        catalogName:"数据统计",
        name:"stats",
        catalogs:[
            {
                catalogName:"整体概况",
                go:"stats/overall"
            },
            {
                catalogName:"工地概况",
                go:"stats/sketch"
            }
        ]
    }
]
