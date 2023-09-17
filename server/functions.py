from models import Cart, InsurancePlan

# Base premium calculation Logic => To be replaced by High precision ML model
def calculate_base_premium(age, city_tier, sum_insured, tenure):
    try:
        age = int(age)
        sum_insured = int(sum_insured)
        tenure = int(tenure)
    except ValueError:
        raise ValueError("Age, sum insured, and tenure must be integers")

    if city_tier == 'Tier-1':
        premium = age * 2 * tenure * sum_insured / 2000
    else:
        premium = age * tenure * sum_insured / 2000

    return premium


# Discount and Final Premium calculation 
def calculate_total_premium(insured_members):

    insured_members.sort(key=lambda x: -x.age)
    total_premium = 0.0

    for index, member in enumerate(insured_members):
        if index == 0:
            member.discounted_rate = member.base_premium
            total_premium += member.base_premium
            member.save()
        else:
            member.discount = 50
            d_rate =  0.5 * member.base_premium
            member.discounted_rate = d_rate
            total_premium += d_rate
            member.save()

    return total_premium

# Cleaning Up old member instances
def clean_up_old_instances(user):
    
    try:
        inactive_plans = InsurancePlan.objects(user=user, status=False)
        for plan in inactive_plans:

            for member in plan.insured_members:
                member.delete()

            plan.delete()
            return True
    except Exception as e:
        return False