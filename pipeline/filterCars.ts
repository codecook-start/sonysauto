import { PipelineStage, Types } from "mongoose";

export const createCarPipeline = (
  pathname: string = "",
  search: string = "",
  detailsFilter: { name: string; values: string[] }[] = [],
  featuresFilter: string[] = [],
  sortStage: Record<string, 1 | -1> = { createdAt: -1 },
  skip: number = 0,
  limit: number = 10,
  carDetailOrderIds: Types.ObjectId[],
  minPrice?: number,
  maxPrice?: number,
): PipelineStage[] => {
  return [
    {
      $match: {
        ...(() => {
          switch (pathname) {
            case "inventory":
              return {};
            case "reserved":
              return {
                pages: { $in: ["reserved", "sold"] },
              };
            default:
              return { $or: [{ pages: pathname }, { pages: { $size: 0 } }] };
          }
        })(),
      },
    },
    {
      $lookup: {
        from: "cardetails",
        localField: "details.detail",
        foreignField: "_id",
        as: "populatedDetails",
      },
    },
    {
      $lookup: {
        from: "cardetailoptions",
        localField: "details.option",
        foreignField: "_id",
        as: "populatedOptions",
      },
    },
    {
      $lookup: {
        from: "features",
        localField: "features",
        foreignField: "_id",
        as: "features",
      },
    },
    {
      $lookup: {
        from: "sellernotes",
        localField: "sellerNotes.note",
        foreignField: "_id",
        as: "populatedNotes",
      },
    },
    {
      $lookup: {
        from: "sellertexts",
        localField: "sellerNotes.text",
        foreignField: "_id",
        as: "populatedTexts",
      },
    },
    {
      $addFields: {
        details: {
          $map: {
            input: "$details",
            as: "detailEntry",
            in: {
              detail: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$populatedDetails",
                      as: "pd",
                      cond: { $eq: ["$$pd._id", "$$detailEntry.detail"] },
                    },
                  },
                  0,
                ],
              },
              option: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$populatedOptions",
                      as: "po",
                      cond: { $eq: ["$$po._id", "$$detailEntry.option"] },
                    },
                  },
                  0,
                ],
              },
              order: {
                $indexOfArray: [carDetailOrderIds, "$$detailEntry.detail"],
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        details: { $sortArray: { input: "$details", sortBy: { order: 1 } } },
      },
    },
    {
      $addFields: {
        numericPrice: {
          $toDouble: {
            $getField: {
              field: "match",
              input: {
                $regexFind: {
                  input: "$price",
                  regex: /\d+(\.\d+)?/,
                },
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        numericSize: {
          $let: {
            vars: {
              size: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$details",
                      as: "detail",
                      cond: { $eq: ["$$detail.detail.name", "L x W x H"] },
                    },
                  },
                  0,
                ],
              },
            },
            in: {
              $toDouble: {
                $getField: {
                  field: "match",
                  input: {
                    $regexFind: {
                      input: "$$size.option.name",
                      regex: "\\d+(\\.\\d+)?",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        numericMileage: {
          $let: {
            vars: {
              mileage: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$details",
                      as: "detail",
                      cond: { $eq: ["$$detail.detail.name", "miles"] },
                    },
                  },
                  0,
                ],
              },
            },
            in: {
              $toDouble: "$$mileage.option.name",
            },
          },
        },
      },
    },
    {
      $addFields: {
        numericWeight: {
          $let: {
            vars: {
              weight: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$details",
                      as: "detail",
                      cond: { $eq: ["$$detail.detail.name", "Weight"] },
                    },
                  },
                  0,
                ],
              },
            },
            in: {
              $toDouble: {
                $arrayElemAt: [
                  {
                    $split: [
                      {
                        $ltrim: {
                          input: {
                            $rtrim: {
                              input: "$$weight.option.name",
                            },
                          },
                        },
                      },
                      " ",
                    ],
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        numericYear: {
          $toInt: {
            $let: {
              vars: {
                yearDoc: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$details",
                        as: "detail",
                        cond: { $eq: ["$$detail.detail.name", "Year"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: "$$yearDoc.option.name",
            },
          },
        },
      },
    },
    {
      $match: {
        ...(detailsFilter.length > 0
          ? {
              details: {
                $all: detailsFilter.map((filter) => ({
                  $elemMatch: {
                    "detail.name": filter.name,
                    "option.name": {
                      $in: filter.values,
                    },
                  },
                })),
              },
            }
          : {}),
      },
    },
    {
      $match: {
        ...(featuresFilter.length > 0
          ? {
              features: {
                $elemMatch: {
                  name: {
                    $in: featuresFilter,
                  },
                },
              },
            }
          : {}),
      },
    },
    ...(search
      ? [
          {
            $match: {
              $or: [
                { title: { $regex: search, $options: "i" } },
                {
                  details: {
                    $elemMatch: {
                      "detail.name": {
                        $regex: "stockId",
                        $options: "i",
                      },
                      "option.name": { $regex: search, $options: "i" },
                    },
                  },
                },
              ],
            },
          },
        ]
      : []),

    {
      $facet: {
        cars: [
          {
            $match: {
              numericPrice: {
                $gte: minPrice || 0,
                $lte: maxPrice || Infinity,
              },
            },
          },
          { $sort: sortStage },
          { $skip: skip },
          { $limit: limit },
        ],
        totalCars: [
          {
            $match: {
              numericPrice: {
                $gte: minPrice || 0,
                $lte: maxPrice || Infinity,
              },
            },
          },
          { $count: "count" },
        ],
        priceRange: [
          {
            $group: {
              _id: null,
              min: { $min: "$numericPrice" },
              max: { $max: "$numericPrice" },
            },
          },
        ],
      },
    },
    {
      $project: {
        cars: 1,
        totalCars: { $arrayElemAt: ["$totalCars.count", 0] },
        priceRange: { $arrayElemAt: ["$priceRange", 0] },
      },
    },
  ];
};
