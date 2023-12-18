# GWAS data sets hosted on this page


## 1. Phenotype Datasets

### 1.1 Camelina
The phenotypic data used for this app is taken from 

[https://github.com/usadellab/untwist-db/tree/main/data](https://github.com/usadellab/untwist-db/tree/main/data)


### 1.2 Brassica

## 2. Genotype Datasets

### 2.1 Camelina

54 accessions comprise this data set. 

### Starting data

The vcf files locate at the following directory was used as starting point for this data set

```sh
/mnt/data/achraf/sequenced_samples/runs/pipe_20210803_UNTWIST/013_gathervcfs_UNT_check_all_reseq/NC_all_gatk_UNT_check_all_reseq.vcf
```

The list of samples included from different sequencing runs is as follows 

```
UNT_001_reseq
UNT_002_reseq
UNT_003_reseq
UNT_004_reseq
UNT_005_reseq
UNT_006_reseq
UNT_007_reseq
UNT_008_reseq
UNT_009_reseq
UNT_010_reseq
UNT_011_reseq
UNT_012_reseq
UNT_013_reseq
UNT_014_reseq
UNT_015_reseq
UNT_016_reseq
UNT_017_reseq
UNT_018_reseq
UNT_019_new
UNT_020_new
UNT_021_new
UNT_022_reseq
UNT_023_reseq
UNT_024_reseq
UNT_025_new
UNT_026_reseq
UNT_027_new
UNT_028_reseq
UNT_029_reseq
UNT_030_reseq
UNT_031_reseq
UNT_032_reseq
UNT_033_reseq
UNT_034_reseq
UNT_035_reseq
UNT_037_reseq
UNT_038_new
UNT_039_reseq
UNT_040_reseq
UNT_042_reseq
UNT_043_reseq
UNT_044_reseq
UNT_045_reseq
UNT_046_reseq
UNT_047_reseq
UNT_050_reseq
UNT_052_reseq
UNT_053_reseq
UNT_054_reseq
UNT_055_reseq
UNT_056_reseq
UNT_057
UNT_058_reseq
UNT_059_reseq
```

### Filtering and formatting to Plink standard format

For individual filtering steps please refer to process.sh file. The statistics for each layer of filtering are reported below.

```
| 1. Total           	| 6,403,593 	|
|--------------------	|-----------	|
| 2. DP >=3          	| 5,170,322 	|
| 3. QUAL >= 20      	| 5,170,322 	|
| 4. F_MISSING < 0.2 	| 4,696,691 	|
| 5. MAF >= 0.05     	| 2,448,578 	|
| 6. biallelic only  	| 2,348,538 	|

```


For population stratification precomputed the following 

1. genome file (same version plink 1.07)

created using the following command


```sh
    ./plink-1.07-x86_64/plink --noweb --bfile plink --genome --allow-no-sex

```

2. pca analysis

precomputed eigenvectors for GWAS analysis 

```
plink --bfile plink --pca 2 --out pca    (i used plink 1.9 for this)

```


### 2.2 Brassica


