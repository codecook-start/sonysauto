import { PipelineStage } from "mongoose";

export const createCarPipelineRaw = (
  pathname: string = "",
  detailsFilter: { name: string; values: string[] }[] = [],
  featuresFilter: string[] = [],
  minPrice?: number,
  maxPrice?: number,
): PipelineStage[] => {
  return [
    {
      $match: {
        ...(pathname === "reserved"
          ? {
              pages: { $in: ["reserved", "sold"] },
            }
          : { $or: [{ pages: pathname }, { pages: { $size: 0 } }] }),
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
      $match: {
        numericPrice: {
          $gte: minPrice || 0,
          $lte: maxPrice || Infinity,
        },
      },
    },
    {
      $project: {
        details: 1,
      },
    },
  ];
};
